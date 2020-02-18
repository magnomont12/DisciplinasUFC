#include<stdio.h>
#include<stdlib.h>
#include"lista.h"

int main(){
	Lista *v=criar_lista(v);
	inserir_primeiro(v,4);
	inserir_elemento(v,7);
	inserir_elemento(v,7);
	inserir_elemento(v,10);
	alterar_elemento(v,7,5);
	printf("Quantidade: %d \n",quantidade_elementos(v));
	posicao_elemento(v,7);
	busca_elemento(v,5);
	imprimir_lista(v);
	printf("\n \n");
	remover_elemento(v,4);
	remover_elemento(v,7);
	imprimir_lista(v);
	if(testa_vazia(v))
		printf("A lista nao e vazia");
	else
		printf("A lista e vazia");
	return 0;	
}
