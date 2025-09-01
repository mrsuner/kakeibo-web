export default function Home() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-base-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">Kakeibo</div>
            
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-base-content hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-base-content hover:text-primary transition-colors">Pricing</a>
              <a href="#about" className="text-base-content hover:text-primary transition-colors">About</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <button className="text-base-content hover:text-primary transition-colors">Sign In</button>
              <button className="btn btn-primary">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-base-200 to-base-300 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-base-content mb-6">
            Take Control of Your <span className="text-primary">Finances</span>
          </h1>
          <p className="text-lg lg:text-xl text-base-content/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            Simple, intuitive expense tracking that helps you understand your spending habits and build better financial wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button className="btn btn-primary btn-lg">
              Start Tracking Free
            </button>
            <button className="btn btn-outline btn-primary btn-lg">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-base-100" id="pricing">
        <div className="max-w-7xl mx-auto px-6 overflow-visible">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg lg:text-xl text-base-content/70">Choose the plan that fits your financial journey</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-4">
            {/* Free Plan */}
            <div className="bg-base-200 border-2 border-primary/20 rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-base-content mb-2">Free</h3>
              <div className="text-4xl font-bold text-primary my-6">$0</div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center"><span className="text-primary mr-3 text-xl">✓</span> 100 transactions per month</li>
                <li className="flex items-center"><span className="text-primary mr-3 text-xl">✓</span> Basic analytics</li>
                <li className="flex items-center"><span className="text-primary mr-3 text-xl">✓</span> 100 MB storage</li>
              </ul>
              <button className="btn btn-outline btn-primary w-full">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-primary text-white rounded-2xl shadow-2xl p-8 text-center transform lg:scale-105 relative overflow-visible">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-secondary text-secondary-content px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shadow-lg">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold mt-6 mb-2">Pro</h3>
              <div className="text-4xl font-bold my-6">$1.99<span className="text-lg">/month</span></div>
              <div className="text-primary-content/70 mb-6">$19.99/year (save 17%)</div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center"><span className="text-primary-content/80 mr-3 text-xl">✓</span> 1,000 transactions per month</li>
                <li className="flex items-center"><span className="text-primary-content/80 mr-3 text-xl">✓</span> Advanced analytics</li>
                <li className="flex items-center"><span className="text-primary-content/80 mr-3 text-xl">✓</span> 10 GB storage</li>
              </ul>
              <button className="btn btn-secondary w-full">
                Start Free Trial
              </button>
            </div>

            {/* Max Plan */}
            <div className="bg-base-200 border-2 border-primary/20 rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-base-content mb-2">Max</h3>
              <div className="text-4xl font-bold text-primary my-6">$6.99<span className="text-lg text-base-content/60">/month</span></div>
              <div className="text-base-content/70 mb-6">$69.99/year (save 17%)</div>
              <ul className="text-left space-y-4 mb-8">
                <li className="flex items-center"><span className="text-primary mr-3 text-xl">✓</span> Unlimited transactions</li>
                <li className="flex items-center"><span className="text-primary mr-3 text-xl">✓</span> Priority support</li>
                <li className="flex items-center"><span className="text-primary mr-3 text-xl">✓</span> 100 GB storage</li>
              </ul>
              <button className="btn btn-outline btn-primary w-full">
                Upgrade Now
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-base-content/70 text-lg">Need more storage? <span className="text-primary font-semibold">$1 per 10 GB</span></p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">What Our Users Say</h2>
            <p className="text-lg lg:text-xl text-base-content/70">Join thousands who've transformed their financial habits</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-base-100 rounded-xl shadow-lg p-8">
              <div className="flex text-warning mb-4">
                <span className="text-xl">★★★★★</span>
              </div>
              <p className="text-base-content/80 mb-6 leading-relaxed">"Kakeibo has completely changed how I think about money. The necessity rating feature helps me reflect on every purchase."</p>
              <div className="flex items-center">
                <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center mr-4 font-semibold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-base-content">Sarah Miller</div>
                  <div className="text-sm text-base-content/60">Marketing Manager</div>
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow-lg p-8">
              <div className="flex text-warning mb-4">
                <span className="text-xl">★★★★★</span>
              </div>
              <p className="text-base-content/80 mb-6 leading-relaxed">"The tagging system is brilliant. I can track exactly how much I spend on different restaurants and make better choices."</p>
              <div className="flex items-center">
                <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center mr-4 font-semibold">
                  DJ
                </div>
                <div>
                  <div className="font-semibold text-base-content">David Johnson</div>
                  <div className="text-sm text-base-content/60">Software Developer</div>
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-xl shadow-lg p-8">
              <div className="flex text-warning mb-4">
                <span className="text-xl">★★★★★</span>
              </div>
              <p className="text-base-content/80 mb-6 leading-relaxed">"Simple, clean interface that doesn't overwhelm. Perfect for someone who wants to start budgeting without complexity."</p>
              <div className="flex items-center">
                <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center mr-4 font-semibold">
                  EM
                </div>
                <div>
                  <div className="font-semibold text-base-content">Emily Chen</div>
                  <div className="text-sm text-base-content/60">Teacher</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-neutral-content py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">Kakeibo</div>
              <p className="text-neutral-content/70 mb-6 leading-relaxed">Simple expense tracking for better financial wellness.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-content/70 hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-neutral-content/70 hover:text-primary transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-neutral-content">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-neutral-content">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-neutral-content">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-content/20 mt-12 pt-8 text-center">
            <p className="text-neutral-content/70">&copy; 2024 Kakeibo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
