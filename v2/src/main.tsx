import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tokens and base come first, and the order is load-bearing. Importing them after `App` put them after every
// surface and component stylesheet in the bundle, so `base.css`'s type roles beat the component steps authored
// against them at equal specificity: `.t-label` at 12px over `.desk-period` and `.card-act` at 10px, `.t-name` at
// 17px over `.card-name` at 15px, and `.t-specimen`'s muted ink over three colours tuned for a tinted ground. The
// small step of the scale did not exist in the build.
import './styles/tokens.css'
import './styles/base.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('no #root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
