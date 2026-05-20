import React from 'react'
import ErrorBoundary from './components/ErrorBoundary.js'
import TaskBoard from './components/TaskBoard.js'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow">
        <h1 className="text-2xl font-semibold">Real-Time Collaborative Task Board</h1>
      </header>
      <main className="p-4">
        <ErrorBoundary>
          <TaskBoard />
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App
