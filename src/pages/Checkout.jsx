import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Checkout = () => {
  return (
    <div className="checkout-page">
      <Header />
      <main className="checkout-main">
        <section className="checkout-content">
          <div className="container">
            <h1>Thanh toán</h1>
            <p>Trang thanh toán sẽ được hoàn thiện trong phiên bản tiếp theo.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
