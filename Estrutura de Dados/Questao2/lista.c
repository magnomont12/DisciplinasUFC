#include<stdio.h>
#include<stdlib.h>
#include"lista.h"

typedef struct lista{
	int ultimoinserido;
	int prim;
	int v[4];
	int* V[4];
}Lista;

Lista* criar_lista(Lista *v){
	v=(Lista*)malloc(sizeof(Lista));
	int i;
	for(i=0;i<4;i++){
		v->V[i]=NULL;
		v->v[i]=-1;
	}
	
	return v;
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
			v->V[v->ultimoinserido]=&v->v[i];
			v->ultimoinserido=i;
			break;
		}
	}
}

int quantidade_elementos(Lista *v){
	int i=v->prim;
	int contador=0;
	while(i >= 0){
		contador++;
		if(v->V[i]==NULL)
			break;
		i=((int)v->V[i] - (int)(&v->v))/sizeof(int);	
	}
	return contador;
}

void imprimir_lista(Lista *v){
	int i=v->prim;
	while(i>=0){
		printf("Elemento da lista: %d \n",v->v[i]);
		if(v->V[i]==NULL)
			break;
		i=((int)v->V[i] - (int)(&v->v))/sizeof(int);	
	}
}

void alterar_elemento(Lista *v, int info, int newInfo){
	int i=v->prim;
	while(i >= 0){
		if(v->v[i]== info){
			v->v[i]=newInfo;
			break;
		}
		if(v->V[i]==NULL)
			break;	
		i=((int)v->V[i] - (int)(&v->v))/sizeof(int);
	}
}



void posicao_elemento(Lista *v, int info){
	int i=v->prim;
	while(i >= 0){
		if(v->v[i]== info)
			printf("o elemento que voce procura esta na casa %d \n", i);
		if(v->V[i]==NULL)
			break;
		i=((int)v->V[i] - (int)(&v->v))/sizeof(int);
	}
}

void busca_elemento(Lista *v, int info){
	int i=v->prim;
	while(i >= 0){
		if(v->v[i]== info)
			printf("O valor que voce buscou possui, e o valor: %d \n",v->v[i]);
		if(v->V[i]==NULL)
			break;
		i=((int)v->V[i] - (int)(&v->v))/sizeof(int);
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

void remover_elemento(Lista *v, int info){
	if(v->v[v->prim]==info){
		int aux;
		v->v[v->prim]=-1;
		aux=v->prim;
		v->prim = ((int)v->V[aux] - (int)(&v->v))/sizeof(int);
		v->V[aux] = NULL;
	}
	
	else if(v->v[v->ultimoinserido]==info){
		int i;
		v->v[v->ultimoinserido]=-1;
		for(i=0;i<4;i++){
			if(v->V[i]==&v->v[v->ultimoinserido])
				v->ultimoinserido=i;
				v->V[v->ultimoinserido]=NULL;
		}
	}
	
	else{
		int i=v->prim;
		int aux;
		while(i >= 0){
			if(v->v[i]== info){
				v->v[i]=-1;
				v->V[aux]=v->V[i];
				v->V[i]=NULL;
				break;
			}
			aux=i;	
			i=(((int)v->V[i]) - ((int)(&v->v)))/sizeof(int);
		}	
	}
	
}
