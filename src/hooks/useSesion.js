import { useState } from "react";
import { guardarSesion, cargarSesion, borrarSesion } from "../api/storage";
import { migrarDatosLocales } from "../logica/migracion";

export function useSesion() {
  const [sesion, setSesion] = useState(cargarSesion());

  async function iniciar(token, user) {
    guardarSesion(token, user);
    await migrarDatosLocales(token);
    setSesion({ token, user });
  }

  function cerrar() {
    borrarSesion();
    setSesion(null);
  }

  return { sesion, iniciar, cerrar };
}