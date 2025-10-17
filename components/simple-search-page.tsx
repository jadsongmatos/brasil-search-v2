"use client"

import type React from "react"

import { Container, Box, Typography, Paper, TextField, InputAdornment, IconButton, Divider } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import MapIcon from "@mui/icons-material/Map"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SimpleSearchPage() {
  const [cepInput, setCepInput] = useState("")
  const router = useRouter()

  const handleCepSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (cepInput.trim()) {
      const cleanCep = cepInput.replace(/\D/g, "").padStart(8, "0")
      router.push(`/cep/${cleanCep}`)
    }
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 100%)",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              mb: 2,
            }}
          >
            Brasil Search
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 6,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Busque informações sobre CEPs, cidades e conteúdo do site
          </Typography>
        </Box>

        {/* Google Custom Search */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <SearchIcon color="primary" />
            <Typography variant="h6" component="h2">
              Busca no Site
            </Typography>
          </Box>

          <Box id="google-cse-container">
            <div className="gcse-search"></div>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
