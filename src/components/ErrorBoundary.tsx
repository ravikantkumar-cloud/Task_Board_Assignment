    
import React from 'react'

type Props = {
  children: React.ReactNode
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Task board render error:', error)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
          <p className="mt-1 text-sm text-red-600">Try reloading this section.</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary