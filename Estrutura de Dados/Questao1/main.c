#include<stdio.h>
#include<stdlib.h>
#include"lista.h"

int main(){
	Lista *v=criar_lista(v);
	
	inserir_primeiro(v,10);
	inserir_elemento(v,5);
	inserir_elemento(v,7);
	
	
	printf("Quantidade: %d\n",quantidade_elementos(v));
	imprimir_lista(v);
	printf("\n \n");
	busca_elemento(v,7);
	alterar_elemento(v,7,12);
	remover_elemento(v,12);
	inserir_elemento(v,10);
	posicao_elemento(v,5);
	printf("Quantidade: %d\n",quantidade_elementos(v));
	imprimir_lista(v);
	if(testa_vazia(v))
		printf("A lista nao e vazia");
	else
		printf("A lista e vazia");
	return 0;
}
