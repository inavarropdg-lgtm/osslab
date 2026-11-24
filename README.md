# osslab

MVP de una app de entrenamiento para practicantes de BJJ: plan de físico, foco técnico semanal, biblioteca de técnicas, comunidad de clips y progreso. Todo en un solo archivo HTML, sin servidor: los datos se guardan en el navegador (localStorage, y los vídeos grabados en IndexedDB).

## Estructura
- `src/`: código fuente (JS y CSS por módulos).
- `dist/index.html`: la app compilada. Ábrela en el navegador. Necesita la carpeta `dist/img/` al lado.
- `build.py`: une `src/` en `dist/index.html`.
- `tests/`: tests con jsdom (t9–t16).

## Uso
```bash
npm install        # instala jsdom para los tests
npm run build      # regenera dist/index.html desde src/
npm test           # ejecuta los tests
```

## Versión
v17: backlog UX completo (foco técnico, onboarding «Tu semana», modo pizarra, check-in de 1 toque, pestaña Comunidad, clips grabados en el móvil).

## Notas
- Las academias, coaches y autores de clips de ejemplo son ficticios.
- Los vídeos de YouTube de la biblioteca son de sus autores; se enlazan, no se alojan.
