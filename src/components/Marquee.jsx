import React, { useMemo } from 'react';

/**
 * Marquee component tạo hiệu ứng chạy vô hạn mượt mà bằng cách nhân đôi danh sách item.
 * Props:
 *  - items: array các chuỗi hoặc ReactNode để hiển thị
 *  - speed: 'slow' | 'normal' | 'fast'
 *  - direction: 'left' | 'right'
 */
const Marquee = ({
  items = [],
  speed = 'normal',
  direction = 'left',
  className = ''
}) => {
  // Nhân đôi nội dung để animation translate có khoảng liền mạch
  const duplicated = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      className={`scroller ${className}`}
      data-animated="true"
      data-speed={speed}
      data-direction={direction}
      role="presentation"
      aria-hidden={items.length === 0}
    >
      <ul className="scroller__inner tag-list">
        {duplicated.map((content, idx) => (
          <li key={idx} aria-hidden={idx >= items.length} className="scroller__item">
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Marquee;
