export default function Privacidad() {
  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a OpenBookDrive
        </a>

        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-invert prose-amber max-w-none space-y-6 text-gray-300">
          <p>Última actualización: 21 de Abril de 2026</p>

          <h2 className="text-xl font-bold text-white mt-8">1. Información que Recopilamos</h2>
          <p>
            OpenBookDrive recopila información de manera limitada para proporcionar el servicio:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Email:</strong> Solo se solicita para funcionalidades de comunidad (subir libros, solicitar títulos)</li>
            <li><strong>Cookies:</strong> Utilizamos cookies esenciales para el funcionamiento del sitio</li>
            <li><strong>Datos de uso:</strong> Recopilamos información anónima sobre cómo se utiliza el servicio</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8">2. Cómo Utilizamos su Información</h2>
          <p>La información recopilada se utiliza para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proporcionar acceso a la biblioteca de libros</li>
            <li>Gestionar la funcionalidad de subir y solicitar libros</li>
            <li>Mejorar y optimizar el servicio</li>
            <li>Responder a sus consultas y solicitudes</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8">3. Almacenamiento de Datos</h2>
          <p>
            Los libros y archivos almacenados en OpenBookDrive residen en Google Drive de cada usuario. 
            No almacenamos copies de los libros en nuestros servidores. Los metadatos de los libros 
            se obtienen de la API pública de OpenLibrary.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">4. Compartir Información</h2>
          <p>
            No vendemos, intercambiamos ni transferimos su información personal a terceros. 
            Podemos compartir información agregada y anónima con fines analyticos.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">5. Seguridad</h2>
          <p>
            Implementamos medidas de seguridad razonables para proteger su información. 
            Sin embargo, no podemos garantizar la seguridad absoluta de ningún sistema.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">6. Enlaces de Terceros</h2>
          <p>
            Nuestro servicio puede contener enlaces a sitios de terceros. No tenemos control 
            sobre el contenido o las prácticas de privacidad de estos sitios.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">7. Derechos del Usuario</h2>
          <p>Usted tiene derecho a:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder a la información que tenemos sobre usted</li>
            <li>Solicitar la eliminación de su información</li>
            <li>Optar por no recibir comunicaciones nuestras</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8">8. Menores de Edad</h2>
          <p>
            Nuestro servicio no está dirigido a menores de edad. No recopilamos 
            intencionalmente información de menores.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">9. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta política periódicamente. Le notificaremos cualquier 
            cambio publicando la nueva política en esta página.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">10. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta política de privacidad, puede contactarnos 
            a través de nuestro repositorio de GitHub.
          </p>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2024 OpenBookDrive. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}