const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              XO <span className="text-accent">ADVISOR</span>
            </h3>
            <p className="text-primary-foreground/80 max-w-md">
              Connecting ex-offenders, veterans, and the homeless with the
              resources they need to rebuild their lives. Hope is beyond
              possible.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#how-it-works" className="hover:text-accent transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-accent transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Housing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Employment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Transportation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Gov. Assistance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/80">
          <p>© {new Date().getFullYear()} XO ADVISOR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
