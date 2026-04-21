export default function Terminos() {
  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a OpenBookDrive
        </a>

        <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-invert prose-amber max-w-none space-y-6 text-gray-300">
          <p>Última actualización: 21 de Abril de 2026</p>

          <h2 className="text-xl font-bold text-white mt-8">1. Aceptación de Términos</h2>
          <p>
            Al acceder y utilizar OpenBookDrive, usted acepta estar sujeto a estos términos y condiciones. 
            Si no está de acuerdo con alguna parte de estos términos, no deberá utilizar nuestro servicio.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">2. Descripción del Servicio</h2>
          <p>
            OpenBookDrive es una plataforma digital que permite a los usuarios compartir y acceder a una 
            biblioteca de libros de forma gratuita. El servicio utiliza Google Drive para el almacenamiento 
            de archivos y OpenLibrary para obtener metadatos de los libros.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">3. Uso Permitido</h2>
          <p>Usted acepta utilizar OpenBookDrive únicamente para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder y descargar libros legalmente disponibles</li>
            <li>Compartir libros que usted tenga derecho a distribuir</li>
            <li>Solicitar libros que estén disponibles públicamente</li>
            <li>Interactuar de manera respetuosa con otros usuarios</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8">4. Propiedad Intelectual</h2>
          <p>
            Los libros disponibles en OpenBookDrive son propiedad de sus respectivos autores y editores. 
            OpenBookDrive no reclama propiedad sobre estos materiales. Los usuarios son responsables de 
            garantizar que tienen los derechos necesarios para compartir cualquier contenido.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">5. Limitación de Responsabilidad</h2>
          <p>
            OpenBookDrive se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que 
            el servicio estará disponible de manera continua o sin errores. No somos responsables de 
            ningún daño directo, indirecto, incidental o consequencial derivado del uso del servicio.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">6. Cuentas de Usuario</h2>
          <p>
            Para ciertas funciones (como subir libros o solicitar títulos), puede requerirse un email 
            para identificación. Usted es responsable de mantener la confidencialidad de su información 
            y de todas las actividades que ocurran bajo su cuenta.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">7. Modificaciones al Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar o discontinuar el servicio en cualquier momento 
            sin previo aviso. No seremos responsables ante usted o terceros por cualquier modificación, 
            suspensión o discontinuación del servicio.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">8. Ley Aplicable</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables. 
            Cualquier disputa derivada de estos términos será resuelta en los tribunales correspondientes.
          </p>

          <h2 className="text-xl font-bold text-white mt-8">9. Contacto</h2>
          <p>
            Si tiene preguntas sobre estos términos, puede contactarnos a través de nuestro 
            repositorio de GitHub.
          </p>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2024 OpenBookDrive. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}