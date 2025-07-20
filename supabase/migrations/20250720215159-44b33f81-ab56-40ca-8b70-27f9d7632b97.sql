
-- Função RPC para exclusão segura de produtos com dependências
-- Esta função deve ser executada no SQL Editor do Supabase

CREATE OR REPLACE FUNCTION delete_product_with_dependencies(product_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cart_count integer := 0;
  favorites_count integer := 0;
  result json;
BEGIN
  -- Iniciar transação implícita (função já roda em transação)
  
  -- Contar e deletar itens do carrinho
  SELECT COUNT(*) INTO cart_count 
  FROM cart_items 
  WHERE cart_items.product_id = delete_product_with_dependencies.product_id;
  
  IF cart_count > 0 THEN
    DELETE FROM cart_items 
    WHERE cart_items.product_id = delete_product_with_dependencies.product_id;
  END IF;
  
  -- Contar e deletar favoritos
  SELECT COUNT(*) INTO favorites_count 
  FROM favorites 
  WHERE favorites.product_id = delete_product_with_dependencies.product_id;
  
  IF favorites_count > 0 THEN
    DELETE FROM favorites 
    WHERE favorites.product_id = delete_product_with_dependencies.product_id;
  END IF;
  
  -- Deletar o produto
  DELETE FROM products 
  WHERE products.id = delete_product_with_dependencies.product_id;
  
  -- Verificar se o produto foi deletado
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produto não encontrado ou não pôde ser excluído';
  END IF;
  
  -- Construir resultado
  result := json_build_object(
    'success', true,
    'cart_items_deleted', cart_count,
    'favorites_deleted', favorites_count,
    'message', 'Produto excluído com sucesso'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, a transação será automaticamente revertida
    RAISE EXCEPTION 'Erro ao excluir produto: %', SQLERRM;
END;
$$;

-- Garantir que apenas admins possam usar esta função
REVOKE ALL ON FUNCTION delete_product_with_dependencies(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_product_with_dependencies(uuid) TO authenticated;
