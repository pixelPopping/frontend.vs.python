import { useState } from 'react';
import Calendar from 'react-calendar';

function Home() {
  const [value, setValue] = useState(new Date());

  return (
    <>
      <header>
        <h1>Novi-Naut in Space</h1>
      </header>

      <main>
        <section>
          <article>
            <Calendar
              onChange={setValue}
              value={value}
            />
          </article>
        </section>

        <section>
          <button>Next</button>
          <button>Back</button>
        </section>
      </main>

      <footer>
        <h1>PixelPopping@Productions</h1>
      </footer>
    </>
  );
}

export default Home;

