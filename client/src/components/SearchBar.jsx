import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')

  function submit(e) {
    e.preventDefault()
    onSearch?.(q)
  }

  return (
    <form onSubmit={submit} className="flex max-w-4xl w-full mx-auto bg-white rounded-lg overflow-hidden shadow-xl">
      <div className="flex items-center pl-5 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        aria-label="Search procedures"
        placeholder="Search procedures, documents, or keywords..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 py-4 px-4 border-0 outline-none text-base text-gray-800 placeholder-gray-400"
      />
      <button 
        type="submit" 
        className="py-4 px-8 bg-primary text-white border-0 cursor-pointer text-base font-semibold transition-colors hover:bg-primary-dark"
      >
        Search
      </button>
    </form>
  )
}
