import { Header } from "@/components/header"
import { BookOpen, Users, Target, Award } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Acerca de Nuestra Biblioteca Virtual</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un espacio dedicado al conocimiento y la excelencia académica
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-12">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Nuestra Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Proporcionar acceso gratuito a recursos académicos de calidad para estudiantes y profesionales de
                diversas áreas del conocimiento.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Nuestra Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la plataforma líder en recursos académicos digitales, facilitando el aprendizaje continuo y el
                desarrollo profesional.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Comunidad</h3>
              <p className="text-muted-foreground leading-relaxed">
                Miles de estudiantes y profesionales confían en nuestra biblioteca para acceder a material educativo de
                alta calidad en múltiples disciplinas.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Calidad</h3>
              <p className="text-muted-foreground leading-relaxed">
                Todos nuestros recursos son cuidadosamente seleccionados para garantizar la mejor experiencia de
                aprendizaje posible.
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-8 space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-foreground">Áreas de Conocimiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nuestra biblioteca virtual ofrece recursos en las siguientes áreas:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Ingeniería en Sistemas Computacionales
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Ingeniería Bioquímica
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Ingeniería Electromecánica
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Ingeniería de Gestión Empresarial
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Arquitectura
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Administración
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <span className="text-primary">•</span> Contador Público
              </li>
            </ul>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Explorar Biblioteca
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-primary text-primary-foreground text-center py-4 mt-12">
        <p className="text-sm">© 2025 Biblioteca Virtual - Todos los derechos reservados</p>
      </footer>
    </div>
  )
}
