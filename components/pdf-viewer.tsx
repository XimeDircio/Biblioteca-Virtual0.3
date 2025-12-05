"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, FileText, RefreshCw } from "lucide-react"

type PDFViewerProps = {
  pdfUrl: string
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [viewerType, setViewerType] = useState<"native" | "google" | "mozilla">("native")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const getViewerUrl = () => {
    switch (viewerType) {
      case "google":
        return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
      case "mozilla":
        return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`
      case "native":
      default:
        return pdfUrl
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const switchViewer = () => {
    setIsLoading(true)
    setHasError(false)
    if (viewerType === "native") {
      setViewerType("google")
    } else if (viewerType === "google") {
      setViewerType("mozilla")
    } else {
      setViewerType("native")
    }
  }

  return (
    <div className="bg-muted rounded-lg overflow-hidden">
      {/* PDF Controls */}
      <div className="bg-card border-b border-border p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Visor de PDF</h3>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
            {viewerType === "native" ? "Nativo" : viewerType === "google" ? "Google Docs" : "Mozilla PDF.js"}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={switchViewer}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Cambiar visor
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir en nueva pestaña
            </a>
          </Button>
          <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
            <a href={pdfUrl} download>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="relative w-full h-[calc(100vh-250px)] min-h-[600px] bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Cargando PDF...</p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <div className="text-center space-y-4 p-6">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-foreground font-medium">No se pudo cargar el PDF</p>
              <p className="text-sm text-muted-foreground">Prueba con otro visor o descarga el archivo</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={switchViewer}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Probar otro visor
                </Button>
                <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <a href={pdfUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {viewerType === "native" ? (
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
            onLoad={handleLoad}
            onError={handleError}
          >
            <iframe
              src={getViewerUrl()}
              className="w-full h-full border-0"
              title="PDF Viewer"
              onLoad={handleLoad}
              onError={handleError}
            />
          </object>
        ) : (
          <iframe
            src={getViewerUrl()}
            className="w-full h-full border-0"
            title="PDF Viewer"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
    </div>
  )
}
