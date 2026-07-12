const FOOTER_LINKS = [
  ['Services', '#services'],
  ['Process', '#process'],
  ['Work', '#work'],
  ['Results', '#results'],
  ['FAQ', '#faq'],
  ['Start a project', '#contact'],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <a href="#" className="footer-brand" aria-label="Content Dost home">
              <span aria-hidden="true">▶</span> Content <strong>Dost</strong>
            </a>
            <p>Content that starts with an idea and ends with something worth watching.</p>
          </div>
          <nav aria-label="Footer navigation">
            {FOOTER_LINKS.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Content Dost</span>
          <a href="mailto:hello@contentdost.agency">hello@contentdost.agency</a>
        </div>
      </div>
    </footer>
  );
}
