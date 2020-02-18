typedef struct lista Lista;
Lista* criar_lista(Lista *v);
void inserir_primeiro(Lista *v, int info);
void inserir_elemento(Lista *v, int info);
int quantidade_elementos(Lista *v);
void imprimir_lista(Lista *v);
void alterar_elemento(Lista *v, int info, int newInfo);
void posicao_elemento(Lista *v, int info);
void busca_elemento(Lista *v, int info);
int testa_vazia(Lista *v);
void remover_elemento(Lista *v, int info);
