import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to={ROUTES.LOGIN}>Back to login</Link>
    </div>
  )
}
