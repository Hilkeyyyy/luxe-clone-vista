
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Instagram, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-outfit font-bold mb-4">VELAR WATCHES</h2>
            <p className="text-neutral-400 mb-6 max-w-md font-light leading-relaxed">
              Especializada em relógios premium de alta qualidade. 
              Tradição, elegância e precisão em cada peça da nossa coleção exclusiva.
            </p>
            
            {/* Social Links - Flat Premium */}
            <div className="flex space-x-4">
              <motion.a
                href="https://www.instagram.com/velar.watches/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/produtos" className="text-neutral-400 hover:text-white transition-colors duration-300 font-light">
                  Produtos
                </a>
              </li>
              <li>
                <a href="/favorites" className="text-neutral-400 hover:text-white transition-colors duration-300 font-light">
                  Favoritos
                </a>
              </li>
              <li>
                <a href="/cart" className="text-neutral-400 hover:text-white transition-colors duration-300 font-light">
                  Carrinho
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-neutral-400" />
                <span className="text-neutral-400 font-light">(19) 99941-3755</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-neutral-400" />
                <span className="text-neutral-400 font-light">contato@velarwatches.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-neutral-500 text-sm font-light">
            © 2025 Velar Watches. Todos os direitos reservados.
          </p>
          
          <motion.div 
            className="flex items-center space-x-1 mt-4 sm:mt-0"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-neutral-500 text-sm font-light">Feito com</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span className="text-neutral-500 text-sm font-light">para relógios premium</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
