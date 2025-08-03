import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: "Polityka Prywatności | DameDesign",
  description:
    "Dowiedz się, jak przetwarzamy Twoje dane osobowe na stronie DameDesign.pl.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Link
        href="/"
        className="fixed top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 w-14 h-14 bg-neutral-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-black transition-colors"
      >
        <ArrowLeft size={24} />
      </Link>
      <main className="pt-32 pb-24 bg-black">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold font-druk-wide mb-4">
              Polityka Prywatności
            </h1>
            <p className="text-neutral-400">
              Ostatnia aktualizacja: 3 sierpnia 2025
            </p>
          </div>
          <div className="prose prose-invert prose-lg max-w-none prose-h2:font-druk-wide prose-h2:text-accent prose-a:text-accent hover:prose-a:text-accent-muted">
            <h2>1. Informacje ogólne</h2>
            <p>
              Niniejsza polityka prywatności określa zasady przetwarzania i
              ochrony danych osobowych przekazywanych przez Użytkowników w
              związku z korzystaniem przez nich z serwisu internetowego
              DameDesign.pl (dalej: &quot;Serwis&quot;).
            </p>

            <h2>2. Administrator Danych Osobowych</h2>
            <p>
              Administratorem Twoich danych osobowych jest{" "}
              <strong>Damian Tomasik</strong>, prowadzący działalność
              nierejestrowaną (dalej: &quot;Administrator&quot;).
            </p>
            <p>
              W sprawach związanych z Twoimi danymi osobowymi możesz
              skontaktować się z Administratorem za pośrednictwem poczty
              elektronicznej: <strong>kontakt@damedesign.pl</strong>.
            </p>

            <h2>3. Jakie dane zbieramy i w jakim celu?</h2>
            <p>
              Korzystanie z Serwisu wiąże się z przetwarzaniem Twoich danych w
              następujących celach:
            </p>
            <ul>
              <li>
                <strong>Formularz kontaktowy:</strong> W przypadku
                skorzystania z formularza kontaktowego, zbieramy dane takie jak
                Twój adres e-mail, tytuł oraz treść wiadomości, a także
                opcjonalnie załączone pliki. Dane te są przetwarzane wyłącznie w
                celu udzielenia odpowiedzi na Twoje zapytanie i prowadzenia
                dalszej korespondencji. Podstawą prawną przetwarzania jest
                Twoja zgoda (art. 6 ust. 1 lit. a RODO).
              </li>
              <li>
                <strong>Analiza i statystyki (Google Analytics):</strong> Serwis
                korzysta z narzędzia Google Analytics w celu zbierania
                anonimowych informacji o Użytkownikach, takich jak odwiedzane
                podstrony, czas spędzony w Serwisie czy rodzaj przeglądarki. Dane
                te pomagają nam w ulepszaniu Serwisu i dostosowywaniu go do
                potrzeb Użytkowników. Przetwarzanie odbywa się na podstawie
                naszego prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f
                RODO).
              </li>
            </ul>

            <h2>4. Pliki Cookies</h2>
            <p>
              Serwis korzysta z plików cookies (tzw. &quot;ciasteczka&quot;). Są to
              niewielkie pliki tekstowe wysyłane przez serwer www i
              przechowywane przez oprogramowanie komputera przeglądarki.
            </p>
            <p>Używamy plików cookies w celu:</p>
            <ul>
              <li>
                Zbierania danych statystycznych za pośrednictwem narzędzia
                Google Analytics.
              </li>
              <li>
                Zapewnienia poprawnego działania kluczowych funkcji Serwisu.
              </li>
            </ul>
            <p>
              W każdej chwili możesz wyłączyć w swojej przeglądarce opcję
              przyjmowania cookies, jednakże może to spowodować utrudnienia w
              korzystaniu z Serwisu.
            </p>

            <h2>5. Twoje prawa</h2>
            <p>
              W związku z przetwarzaniem Twoich danych osobowych, przysługują
              Ci następujące prawa:
            </p>
            <ul>
              <li>Prawo dostępu do swoich danych oraz otrzymania ich kopii.</li>
              <li>Prawo do sprostowania (poprawiania) swoich danych.</li>
              <li>Prawo do usunięcia danych.</li>
              <li>Prawo do ograniczenia przetwarzania danych.</li>
              <li>Prawo do wniesienia sprzeciwu wobec przetwarzania danych.</li>
              <li>Prawo do przenoszenia danych.</li>
              <li>
                Prawo do wniesienia skargi do organu nadzorczego (Prezesa
                Urzędu Ochrony Danych Osobowych).
              </li>
            </ul>

            <h2>6. Bezpieczeństwo danych</h2>
            <p>
              Dbamy o bezpieczeństwo Twoich danych osobowych. Stosujemy
              odpowiednie środki techniczne i organizacyjne, aby chronić Twoje
              dane przed przypadkowym lub niezgodnym z prawem zniszczeniem,
              utratą, modyfikacją, nieuprawnionym ujawnieniem lub
              nieuprawnionym dostępem.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
