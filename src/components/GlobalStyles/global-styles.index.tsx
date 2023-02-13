import  { ReactNode } from 'react'
import './reset.scss'
import './grid.scss'
import './base.scss'

import 'antd/dist/reset.css';
const GlobalStyles = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
  };

export default GlobalStyles