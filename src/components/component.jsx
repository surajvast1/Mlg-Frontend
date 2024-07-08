"use client"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import SearchBar from "./ui/SearchBar"
import { useState } from 'react';
import axios from 'axios';
import Particle from "./ui/Particle"

export function Component() {



  const [review, setReview] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!review) {
      setError('Please enter some text.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for CORS with cookies
        body: JSON.stringify({ review }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSentiment(data.sentiment);
    } catch (err) {
      setError('An error occurred while analyzing the sentiment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    (<div className="flex min-h-[100dvh] flex-col bg-gray-1000 text-gray-50">
      {/* <Particle/> */}
      <header
        className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b border-gray-800">
        <Link className="flex items-center gap-2" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="font-medium">IMdb Sentiment Analysis</span>
        </Link>
        <div className="ml-auto flex items-center gap-4 sm:gap-6">
        
          <nav className="flex gap-4 sm:gap-6">
            <Link
              className="text-xl font-medium hover:underline underline-offset-4"
              href="#">
              Features
            </Link>
            <Link
              className="text-xl font-medium hover:underline underline-offset-4"
              href="#">
              Pricing
            </Link>
            <Link
              className="text-xl font-medium hover:underline underline-offset-4"
              href="#">
              About
            </Link>
            <Link
              className="text-xl font-medium hover:underline underline-offset-4"
              href="#">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* ... */}

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">IMdb Sentiment Analyzer</h1>
              <p className="text-gray-400">Analyze the sentiment of your imdb movie.</p>
            </div>


            <SearchBar/>
            {/* <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2 relative">
                <Label className="text-gray-400" htmlFor="url">
                  Text
                </Label>
                <Input
                  className="pr-12 bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
                  id="url"
                  placeholder="Write a comment here"
                  type="text"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    className="h-8 w-8"
                    size="icon"
                    type="submit"
                    disabled={loading}
                  >
                    <SearchIcon className="h-4 w-4" />
                    <span className="sr-only">Analyze</span>
                  </Button>
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {sentiment && (
                <div className="flex items-center justify-center gap-2 text-2xl">
                  <span className="font-medium">Sentiment:</span>
                  <span className={sentiment === 'Positive' ? 'text-green-400' : 'text-red-400'}>
                    {sentiment === 'Positive' ? '😀' : '😞'}
                  </span>
                  <span>{sentiment}</span>
                </div>
              )}
            </form> */}
          </div>
        </div>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 Sentiment Analysis. Made with  ❤️ -by Varsa and Shubham .</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>)
  );
}

function MountainIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>)
  );
}


function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}
