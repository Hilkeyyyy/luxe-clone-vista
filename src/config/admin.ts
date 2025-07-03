
// Configurações de administrador - removidas credenciais hardcoded
export const ADMIN_CONFIG = {
  // Admin UID agora deve ser configurado via variável de ambiente
  WHATSAPP_NUMBER: '5586988388124'
} as const;

// Função para verificar se usuário é admin via backend
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    // Esta verificação agora depende exclusivamente das políticas RLS
    // e da função get_current_user_role() no banco de dados
    return false; // Placeholder - a verificação real acontece no backend
  } catch (error) {
    console.error('Erro ao verificar status de admin:', error);
    return false;
  }
};
