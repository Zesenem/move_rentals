function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-12">
      <div className="container mx-auto px-6 py-6 text-center text-sm">
        <p>&copy; {currentYear} Move Rentals. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
