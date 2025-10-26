const Explore = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg aria-label='Khám phá' className={className} fill={color} height={size} role='img' viewBox='0 0 24 24' width='24'>
    <title>Khám phá</title>
    <polygon
      fill='none'
      points='13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953'
      stroke='currentColor'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='2'
    ></polygon>
    <polygon fill-rule='evenodd' points='10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056'></polygon>
    <circle
      cx='12.001'
      cy='12.005'
      fill='none'
      r='10.5'
      stroke='currentColor'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='2'
    ></circle>
  </svg>
)

const Message = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg className={className} fill={color} height={size} role='img' viewBox='0 0 24 24' width='24'>
    <title>Messenger</title>
    <path
      d='M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z'
      fill='none'
      stroke='currentColor'
      stroke-miterlimit='10'
      stroke-width='1.739'
    ></path>
    <path
      d='M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z'
      fill-rule='evenodd'
    ></path>
  </svg>
)

export { Explore, Message }
