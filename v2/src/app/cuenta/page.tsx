import type { Metadata } from "next";
import { AccountView } from "@/components/account-view";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description:
    "Espacio del maestro: inicia sesión con tu correo o Google, guarda lecciones favoritas y personaliza tu perfil.",
  robots: { index: false },
};

export default function CuentaPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <AccountView />
      <p className="mt-10 text-center text-xs leading-relaxed text-ink-300">
        Tus datos son privados: solo tú ves tus favoritas y tu perfil. Las
        cuentas son para adultos; no pedimos información de los niños.
      </p>
    </div>
  );
}
