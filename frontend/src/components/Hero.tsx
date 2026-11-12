
interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-eyebrow">
          ✳ YOUR CAMPUS FOOD GUIDE — 2026
        </span>

        <h1>
          Good Food.
          <br />
          <em>Good Mood!</em>
        </h1>

        <p>
          Jelajahi warung favorit di kantin kampus.
          Dari makanan berat sampai jajanan ringan,
          semua ada di sini!
        </p>

        <button
          type="button"
          className="hero-button"
          onClick={onExplore}
        >
          Explore the Canteen ↗
        </button>
      </div>

      <div className="hero-collage" aria-hidden="true">
        <div className="food-polaroid polaroid-one">
          <img src="/images/nasigoreng.png" alt="" />
          <span>GOOD EATS ✳</span>
        </div>

        <div className="food-polaroid polaroid-two">
          <img src="/images/ayam-katsu.png" alt="" />
          <span>YUM YUM!</span>
        </div>

        <div className="food-polaroid polaroid-three">
          <img src="/images/es-kopi.png" alt="" />
          <span>SIP & CHILL</span>
        </div>

        <span className="hero-sticker">
          100%
          <br />
          GOOD
          <br />
          VIBES
        </span>

        <span className="hero-star">✳</span>
      </div>
    </section>
  );
}
