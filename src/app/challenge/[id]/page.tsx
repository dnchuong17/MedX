"use client"

import React, { useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, UploadCloud } from "lucide-react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import BottomNavigation from "@/components/navbar"

const ChallengeEvidencePage = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      if (e.target.files[0].type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(e.target.files[0]))
      } else {
        setPreviewUrl(null)
      }
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      if (e.dataTransfer.files[0].type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]))
      } else {
        setPreviewUrl(null)
      }
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setIsLoading(true)
    // Fake upload delay
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle>Upload Evidence for Challenge #{id}</CardTitle>
            <CardDescription>
              Please upload a photo or file as evidence to complete this
              challenge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center space-y-4 py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                <p className="text-green-600 font-medium text-lg">
                  Upload successful!
                </p>
                <Button onClick={() => router.push("/home")}>
                  Back to Home
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleUpload}
                className="flex flex-col space-y-6"
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors cursor-pointer relative",
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-100 hover:border-blue-400"
                  )}
                  onClick={() => inputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  tabIndex={0}
                  role="button"
                  aria-label="Choose file or drag and drop"
                >
                  <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm text-gray-700 mb-1">
                    Drag & drop or click to select a file
                  </span>
                  <span className="text-xs text-gray-400">
                    (JPG, PNG, PDF, max 10MB)
                  </span>
                  <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  {file && (
                    <div className="mt-4 w-full flex flex-col items-center">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border mb-2"
                        />
                      ) : (
                        <span className="text-xs text-gray-600">
                          {file.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="flex items-center justify-center"
                  disabled={!file || isLoading}
                >
                  {isLoading ? (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2 animate-bounce" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Upload Evidence
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <BottomNavigation />
    </div>
  )
}

export default ChallengeEvidencePage
