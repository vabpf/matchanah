import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Sự khác biệt giữa các loại matcha Natsu, Haru, và Aki là gì?',
      answer: 'Haru (Mùa xuân) là loại matcha cao cấp nhất của chúng tôi, lý tưởng để uống theo kiểu truyền thống. Natsu (Mùa hè) có vị cân bằng, hoàn hảo cho món lattes và uống hàng ngày. Aki (Mùa thu) có hương vị đậm đà hơn, phù hợp nhất để nấu ăn và làm bánh.',
    },
    {
      question: 'Tôi là người mới bắt đầu, tôi nên chọn loại matcha nào?',
      answer: 'Chúng tôi khuyên bạn nên bắt đầu với Natsu. Nó có hương vị rất dễ tiếp cận và rất tuyệt cho món matcha lattes, đây là một khởi đầu tuyệt vời cho bất kỳ ai mới làm quen với matcha.',
    },
    {
      question: 'Lợi ích sức khỏe của việc uống matcha là gì?',
      answer: 'Matcha rất giàu chất chống oxy hóa, giúp tăng cường trao đổi chất, cung cấp năng lượng bền vững mà không gây bồn chồn, và thúc đẩy sự thư giãn và tập trung tinh thần nhờ L-Theanine.',
    },
    {
      question: 'Tôi có cần dụng cụ pha matcha truyền thống không?',
      answer: 'Mặc dù các dụng cụ truyền thống như chasen (cây đánh matcha) và chawan (bát matcha) giúp tạo ra một lớp bọt mịn, nhưng bạn hoàn toàn có thể bắt đầu bằng một chiếc máy đánh trứng hoặc bình lắc nhỏ. Chúng tôi có bán bộ dụng cụ dành cho người mới bắt đầu để giúp bạn có trải nghiệm tốt nhất.',
    },
    {
      question: 'Mỗi khẩu phần có bao nhiêu caffeine?',
      answer: 'Một khẩu phần matcha (khoảng 1 muỗng cà phê) thường chứa khoảng 60-70mg caffeine. Không giống như cà phê, matcha cung cấp năng lượng từ từ và bền vững nhờ axit amin L-Theanine.',
    },
    {
      question: 'Làm thế nào để bảo quản matcha?',
      answer: 'Để giữ matcha luôn tươi mới, hãy bảo quản trong hộp kín ở nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp. Tủ lạnh là một lựa chọn tuyệt vời để duy trì hương vị và chất dinh dưỡng của nó.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <Header />
      <main className="faq-main">      
        <section className="faq-section">
          <div className="container">
            <h2>Các câu hỏi thường gặp</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={index}>
                  <button className="faq-question" onClick={() => toggleFaq(index)}>
                    {faq.question}
                  </button>
                  <div className="faq-answer" style={{ display: openIndex === index ? 'block' : 'none' }}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;