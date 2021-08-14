#include<stdio.h>
#include<stdlib.h>
#include"lista.h"

typedef struct lista{
	int ultimoinserido;
	int prim;
	int v[4];
	int V[4];
}Lista;

Lista* criar_lista(Lista *v){
	int i;
	v=(Lista*)malloc(sizeof(Lista));
	for(i=0;i<4;i++){
		v->V[i]=-1;
		v->v[i]=-1;
	}
	
	return v;
}

int quantidade_elementos(Lista *v){
	int i=v->prim;
	int contador=0;
	while(i != -1){
		contador++;
		i=v->V[i];	
	}
	return contador;
}
void imprimir_lista(Lista *v){
	int i=v->prim;
	while(i != -1){
		printf("Elemento da lista: %d \n",v->v[i]);
		i=v->V[i];	
	}
}

void posicao_elemento(Lista *v, int info){
	int i=v->prim;
	while(i != -1){
		if(v->v[i]== info)
			printf("o elemento que voce procura esta na casa %d \n", i);
		i=v->V[i];
	}
}

void busca_elemento(Lista *v, int info){
	int i=v->prim;
	while(i != -1){
		if(v->v[i]== info)
			printf("O valor que voce buscou possui, e o valor: %d",v->v[i]);
		i=v->V[i];
	}
}

void alterar_elemento(Lista *v, int info, int newInfo){
	int i=v->prim;
	while(i != -1){
		if(v->v[i]== info){
			v->v[i]=newInfo;
			break;
		}
			
		i=v->V[i];
	}
}

void inserir_primeiro(Lista *v, int info){
	v->prim=0;
	v->ultimoinserido=0;
	v->v[0]=info;
	
}

void inserir_elemento(Lista *v, int info){
	int i;
	for(i=0;i<4;i++){
		if(v->v[i]==-1){
			v->v[i] = info;
			v->V[v->ultimoinserido]=i;
			v->ultimoinserido=i;
			break;
		}
	}
}

void remover_elemento(Lista *v, int info){
	if(v->v[v->prim]==info){
		int aux;
		v->v[v->prim]=-1;
		aux=v->prim;
		v->prim = v->V[aux];
		v->V[aux] = -1;
		
	}
	else if(v->v[v->ultimoinserido]==info){
		int i;
		v->v[v->ultimoinserido]=-1;
		for(i=0;i<4;i++){
			if(v->V[i]==v->ultimoinserido)
				v->ultimoinserido=i;
				v->V[v->ultimoinserido]=-1;
		}
	}
	else{
		int i=v->prim;
		int aux;
		while(i != -1){
			if(v->v[i]== info){
				v->v[i]=-1;
				v->V[aux]=v->V[i];
				v->V[i]=-1;
				break;
			}
			aux=i;	
			i=v->V[i];
		}	
	}
	
}

int testa_vazia(Lista *v){
	int i=0;
	for(i=0;i<4;i++){
		if(v->v[i]!=-1)
			return 1;
	}
	return 0;
}

