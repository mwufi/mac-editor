'use client'

import Database from '@tauri-apps/plugin-sql'
import { useEffect } from 'react'


async function test() {
  const db = await Database.load('sqlite:test.db')
  console.log(db)
}

export default function Page() {
  return <div>
    DB!
    <button onClick={test}>Test</button>
  </div>
}