import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './i18n'
import './index.css'
import { router } from './routers'

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
