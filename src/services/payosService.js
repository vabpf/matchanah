// PayOS Service for handling payments with proper PayOS API integration
import config from '../config/config.js';
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';

class PayOSService {
  constructor() {
    this.initialized = false;
    this.isCreatingPayment = false; // Prevent double payment creation
    this.payosConfig = config.payos;
    this.baseURL = 'https://api-merchant.payos.vn';
    
    // Validate required credentials
    if (!this.payosConfig.clientId || !this.payosConfig.apiKey || !this.payosConfig.checksumKey) {
      console.error('PayOS credentials missing. Please check your environment variables.');
    }
  }

  // Initialize PayOS service
  async initialize() {
    if (this.initialized) {
      return Promise.resolve();
    }

    try {
      // Validate configuration
      this.validateConfig();
      this.initialized = true;
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Validate PayOS configuration
  validateConfig() {
    const required = ['clientId', 'apiKey', 'checksumKey'];
    for (const field of required) {
      if (!this.payosConfig[field]) {
        throw new Error(`Missing PayOS ${field}. Please check your .env file.`);
      }
    }
  }

  // Generate QR code image from PayOS QR data
  async generateQRCodeImage(qrData) {
    try {
      if (!qrData) {
        throw new Error('QR data is required');
      }
      
      // Generate QR code as base64 image
      const qrCodeImage = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      // Remove the data URL prefix to get just the base64 data
      return qrCodeImage.replace(/^data:image\/png;base64,/, '');
    } catch (error) {
      console.error('Error generating QR code image:', error);
      throw new Error('Không thể tạo mã QR');
    }
  }

  // Create PayOS payment link using official API
  async createPaymentLink(orderData) {
    try {
      await this.initialize();

      // Check if we're already processing a payment to prevent double creation
      if (this.isCreatingPayment) {
        console.log('⚠️ Payment creation already in progress, waiting...');
        // Wait for existing creation to complete
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (!this.isCreatingPayment) {
              clearInterval(checkInterval);
              const existing = localStorage.getItem('pendingPayment');
              if (existing) {
                const data = JSON.parse(existing);
                resolve({ success: true, data });
              } else {
                resolve({ success: false, error: 'Payment creation failed' });
              }
            }
          }, 100);
        });
      }

      this.isCreatingPayment = true;
      
      // Validate order data
      if (!orderData || !orderData.items || orderData.items.length === 0) {
        throw new Error('Thông tin đơn hàng không hợp lệ');
      }

      if (!orderData.total || orderData.total <= 0) {
        throw new Error('Số tiền thanh toán không hợp lệ');
      }

      // Generate order code (must be unique)
      const orderCode = this.generateOrderCode();
      const amount = Math.round(orderData.total);
      
      console.log('💳 Creating PayOS payment with order code:', orderCode);
      
      // Prepare PayOS payment data
      const paymentData = {
        orderCode: orderCode,
        amount: amount,
        description: `DH${orderCode}`.substring(0, 25), // PayOS limit: 25 characters, DH = Don Hang
        items: orderData.items.map(item => ({
          name: item.name || 'San pham',
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        returnUrl: this.payosConfig.returnUrl || `${window.location.origin}/payment-return`,
        cancelUrl: this.payosConfig.cancelUrl || `${window.location.origin}/cart`,
        signature: '' // Will be calculated
      };

      // Calculate signature
      paymentData.signature = this.calculateSignature(paymentData);

      console.log('📊 PayOS payment data prepared:', {
        orderCode: paymentData.orderCode,
        amount: paymentData.amount,
        description: paymentData.description,
        itemCount: paymentData.items.length
      });

      // Call PayOS API to create payment link
      const response = await this.callPayOSAPI('/v2/payment-requests', 'POST', paymentData);
      
      if (response.success && response.data) {
        console.log('✅ PayOS API response:', {
          orderCode: response.data.orderCode,
          status: response.data.status,
          hasQrCode: !!response.data.qrCode,
          hasCheckoutUrl: !!response.data.checkoutUrl
        });

        // Generate QR code image from PayOS QR data
        let qrCodeImage = null;
        if (response.data.qrCode) {
          try {
            qrCodeImage = await this.generateQRCodeImage(response.data.qrCode);
            console.log('✅ QR code image generated successfully');
          } catch (qrError) {
            console.error('⚠️ Failed to generate QR code image:', qrError);
            // Continue without QR image, user can still use checkout URL
          }
        }

        // Store payment data for validation with additional fields
        const storedData = {
          ...paymentData,
          checkoutUrl: response.data.checkoutUrl,
          qrCode: qrCodeImage || response.data.qrCode, // Use generated image or fallback to original
          qrCodeData: response.data.qrCode, // Store original QR data
          paymentLinkId: response.data.paymentLinkId,
          accountName: response.data.accountName,
          accountNumber: response.data.accountNumber,
          bin: response.data.bin,
          currency: response.data.currency,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('pendingPayment', JSON.stringify(storedData));

        return {
          success: true,
          data: {
            orderCode: orderCode,
            amount: amount,
            description: paymentData.description,
            checkoutUrl: response.data.checkoutUrl,
            qrCode: qrCodeImage || response.data.qrCode, // Use generated image or fallback to original
            qrCodeData: response.data.qrCode, // Original QR data
            paymentLinkId: response.data.paymentLinkId,
            accountName: response.data.accountName,
            accountNumber: response.data.accountNumber,
            bin: response.data.bin,
            currency: response.data.currency,
            status: response.data.status
          }
        };
      } else {
        throw new Error(response.message || 'Không thể tạo liên kết thanh toán');
      }

    } catch (error) {
      console.error('💥 Error creating PayOS payment:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.isCreatingPayment = false;
    }
  }

  // Calculate PayOS signature
  calculateSignature(data) {
    try {
      // PayOS signature format: amount&cancelUrl&description&orderCode&returnUrl
      const signatureString = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${data.orderCode}&returnUrl=${data.returnUrl}`;
      
      // Create HMAC-SHA256 signature
      const signature = CryptoJS.HmacSHA256(signatureString, this.payosConfig.checksumKey).toString(CryptoJS.enc.Hex);
      
      return signature;
    } catch (error) {
      console.error('Error calculating signature:', error);
      throw new Error('Không thể tạo chữ ký thanh toán');
    }
  }

  // Call PayOS API
  async callPayOSAPI(endpoint, method = 'GET', data = null) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'x-client-id': this.payosConfig.clientId,
        'x-api-key': this.payosConfig.apiKey
      };

      const options = {
        method,
        headers,
        mode: 'cors'
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const responseData = await response.json();

      // Debug: log full response
      console.log('🔍 Full PayOS API Response:', {
        status: response.status,
        ok: response.ok,
        dataKeys: responseData.data ? Object.keys(responseData.data) : 'no data',
        qrCodePresent: !!responseData.data?.qrCode,
        qrCodeType: typeof responseData.data?.qrCode,
        qrCodeLength: responseData.data?.qrCode?.length,
        qrCodeSample: responseData.data?.qrCode?.substring(0, 50)
      });

      if (response.ok) {
        return {
          success: true,
          data: responseData.data,
          message: responseData.desc
        };
      } else {
        return {
          success: false,
          error: responseData.desc || `HTTP ${response.status}`,
          message: responseData.desc
        };
      }

    } catch (error) {
      console.error('PayOS API Error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Không thể kết nối đến PayOS. Vui lòng kiểm tra kết nối mạng.'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Lỗi không xác định từ PayOS'
      };
    }
  }

  // Get PayOS payment details
  async getPaymentDetails(orderCode) {
    try {
      const response = await this.callPayOSAPI(`/v2/payment-requests/${orderCode}`, 'GET');
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.error || 'Không thể lấy thông tin thanh toán'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify PayOS webhook signature
  verifyWebhookSignature(data, receivedSignature) {
    try {
      // Create signature string from webhook data
      const signatureString = `amount=${data.amount}&code=${data.code}&desc=${data.desc}&orderCode=${data.orderCode}&success=${data.success}`;
      
      // Calculate expected signature
      const expectedSignature = CryptoJS.HmacSHA256(signatureString, this.payosConfig.checksumKey).toString(CryptoJS.enc.Hex);
      
      return expectedSignature === receivedSignature;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  // Handle PayOS return URL
  parseReturnUrl(searchParams) {
    const result = {
      code: searchParams.get('code'),
      id: searchParams.get('id'),
      cancel: searchParams.get('cancel') === 'true',
      status: searchParams.get('status'),
      orderCode: searchParams.get('orderCode'),
      amount: searchParams.get('amount'),
      success: searchParams.get('success') === 'true'
    };
    
    console.log('Parsed PayOS return URL:', result);
    return result;
  }

  // Validate payment return data
  validatePaymentReturn(returnData, storedPaymentData) {
    try {
      // Check if essential data exists
      if (!returnData || !storedPaymentData) {
        return {
          valid: false,
          error: 'Missing payment data'
        };
      }

      // Validate order code matches
      if (returnData.orderCode && storedPaymentData.orderCode) {
        if (returnData.orderCode.toString() !== storedPaymentData.orderCode.toString()) {
          return {
            valid: false,
            error: 'Order code mismatch'
          };
        }
      }

      // Validate amount if present
      if (returnData.amount && storedPaymentData.amount) {
        if (parseInt(returnData.amount) !== parseInt(storedPaymentData.amount)) {
          return {
            valid: false,
            error: 'Amount mismatch'
          };
        }
      }

      return {
        valid: true
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Verify payment status with PayOS
  async verifyPaymentStatus(orderCode) {
    try {
      const paymentDetails = await this.getPaymentDetails(orderCode);
      
      if (paymentDetails.success) {
        const data = paymentDetails.data;
        return {
          success: true,
          data: {
            orderCode: data.orderCode,
            status: data.status,
            amount: data.amount,
            paidAt: data.paidAt,
            paymentMethod: 'PayOS',
            transactionId: data.id
          }
        };
      } else {
        return {
          success: false,
          error: paymentDetails.error
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate unique order code
  generateOrderCode() {
    // PayOS requires unique order codes - use timestamp + random
    return parseInt(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
  }

  // Format price for display
  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  // Clean up stored payment data
  cleanupPaymentData() {
    try {
      localStorage.removeItem('pendingPayment');
      localStorage.removeItem('paymentSuccess');
      localStorage.removeItem('paymentCancelled');
    } catch (error) {
      console.error('Error cleaning up payment data:', error);
    }
  }

  // Check if PayOS is properly configured
  isConfigured() {
    return !!(this.payosConfig.clientId && this.payosConfig.apiKey && this.payosConfig.checksumKey);
  }

  // Get PayOS configuration status
  getConfigStatus() {
    return {
      configured: this.isConfigured(),
      clientId: !!this.payosConfig.clientId,
      apiKey: !!this.payosConfig.apiKey,
      checksumKey: !!this.payosConfig.checksumKey,
      environment: this.payosConfig.environment || 'development'
    };
  }
}

// Export singleton instance
const payOSService = new PayOSService();
export default payOSService;