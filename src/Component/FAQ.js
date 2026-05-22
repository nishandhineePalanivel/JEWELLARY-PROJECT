import React, { useState } from 'react';
import './Jewel.css';

const faqData = [
  {
    question: 'What materials are used in your jewelry?',
    answer: 'We use high-quality gold, silver, pearls, and certified precious stones.'
  },
  {
    question: 'Can I customize a jewelry piece?',
    answer: 'Yes, we accept customization requests. Please contact our support team.'
  },
  {
    question: 'What is your return policy?',
    answer: 'You can return any product within 7 days of delivery if unused and in original condition.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we only ship within India but are working on international delivery options.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, a tracking number will be emailed to you.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4">❓ Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div
          key={index}
          onClick={() => toggleAnswer(index)}
          style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '15px 20px',
            marginBottom: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
        >
          <h5>{faq.question}</h5>
          {openIndex === index && (
            <p style={{ marginTop: '10px', color: '#ccc' }}>{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;