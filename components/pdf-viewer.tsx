"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Download, ExternalLink } from "lucide-react"

type PDFViewerProps = {
  pdfUrl: string
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [scale, setScale] = useState(100)
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  const handleZoomIn = () => {
    if (scale < 200) setScale(scale + 25)
  }

  const handleZoomOut = () => {
    if (scale > 50) setScale(scale - 25)
  }

  return (
    <div className="bg-muted rounded-lg overflow-hidden">
      {/* PDF Controls */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Visor de PDF</h3>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={scale <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center text-foreground">{scale}%</span>
          <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={scale >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir en nueva pestaña
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={pdfUrl} download>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="w-full h-[calc(100vh-300px)] bg-muted">
        <iframe src={googleDocsViewerUrl} className="w-full h-full border-0" title="PDF Viewer" loading="lazy" />
      </div>
    </div>
  )
}
