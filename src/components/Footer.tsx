
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-neutral-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-outfit font-bold mb-4">Mega Clones</h3>
            <p className="text-neutral-300 font-outfit mb-6 leading-relaxed">
              Produtos premium com qualidade excepcional. Sua satisfação é nossa prioridade.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-outfit font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              {['Produtos', 'Categorias', 'Sobre Nós', 'Contato', 'FAQ'].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-neutral-300 hover:text-white font-outfit transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-outfit font-semibold mb-4">Categorias</h4>
            <ul className="space-y-3">
              {['Premium', 'Professional', 'Elite', 'Ultra', 'Master'].map((category, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-neutral-300 hover:text-white font-outfit transition-colors"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-outfit font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center text-neutral-300">
                <Mail size={16} className="mr-3" />
                <span className="font-outfit">contato@megaclones.com</span>
              </div>
              <div className="flex items-center text-neutral-300">
                <Phone size={16} className="mr-3" />
                <span className="font-outfit">(11) 9999-9999</span>
              </div>
              <div className="flex items-center text-neutral-300">
                <MapPin size={16} className="mr-3" />
                <span className="font-outfit">São Paulo, SP</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-neutral-800 mt-12 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-neutral-400 font-outfit">
            © 2024 Mega Clones. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
