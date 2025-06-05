#!/bin/bash

# Script de vérification post-déploiement
# Usage: ./verify-deployment.sh [URL_DU_SITE]

set -e

SITE_URL=${1:-"http://localhost"}
API_URL="https://fakestoreapi.com"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Vérification du déploiement pour : $SITE_URL${NC}"
echo "================================================"

# Fonction pour les tests
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    echo -n "Test: $name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10); then
        if [ "$response" = "$expected_status" ]; then
            echo -e "${GREEN}✅ OK ($response)${NC}"
            return 0
        else
            echo -e "${RED}❌ ERREUR (HTTP $response)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ TIMEOUT OU ERREUR RÉSEAU${NC}"
        return 1
    fi
}

# Tests de l'application web
echo -e "\n${YELLOW}📱 Tests de l'application web${NC}"
echo "--------------------------------"

test_endpoint "Page d'accueil" "$SITE_URL"
test_endpoint "Assets statiques (favicon)" "$SITE_URL/favicon.ico"

# Tests de l'API FakeStore
echo -e "\n${YELLOW}🛒 Tests de l'API FakeStore${NC}"
echo "--------------------------------"

test_endpoint "API - Produits" "$API_URL/products"
test_endpoint "API - Catégories" "$API_URL/products/categories"
test_endpoint "API - Produit spécifique" "$API_URL/products/1"
test_endpoint "API - Auth" "$API_URL/auth/login" "404"

# Tests de performance
echo -e "\n${YELLOW}⚡ Tests de performance${NC}"
echo "--------------------------------"

if command -v curl > /dev/null; then
    echo -n "Temps de réponse de l'app... "
    response_time=$(curl -o /dev/null -s -w "%{time_total}" "$SITE_URL" --max-time 10)
    if (( $(echo "$response_time < 3.0" | bc -l) )); then
        echo -e "${GREEN}✅ Rapide (${response_time}s)${NC}"
    elif (( $(echo "$response_time < 5.0" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Acceptable (${response_time}s)${NC}"
    else
        echo -e "${RED}❌ Lent (${response_time}s)${NC}"
    fi
    
    echo -n "Temps de réponse de l'API... "
    api_response_time=$(curl -o /dev/null -s -w "%{time_total}" "$API_URL/products" --max-time 10)
    if (( $(echo "$api_response_time < 2.0" | bc -l) )); then
        echo -e "${GREEN}✅ Rapide (${api_response_time}s)${NC}"
    elif (( $(echo "$api_response_time < 4.0" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Acceptable (${api_response_time}s)${NC}"
    else
        echo -e "${RED}❌ Lent (${api_response_time}s)${NC}"
    fi
fi

# Tests de sécurité (headers)
echo -e "\n${YELLOW}🔒 Tests de sécurité${NC}"
echo "--------------------------------"

if headers=$(curl -I -s "$SITE_URL" --max-time 10); then
    echo -n "Headers de sécurité... "
    security_score=0
    
    if echo "$headers" | grep -i "x-frame-options" > /dev/null; then
        ((security_score++))
    fi
    if echo "$headers" | grep -i "x-content-type-options" > /dev/null; then
        ((security_score++))
    fi
    if echo "$headers" | grep -i "x-xss-protection" > /dev/null; then
        ((security_score++))
    fi
    
    if [ $security_score -ge 2 ]; then
        echo -e "${GREEN}✅ Bonne sécurité ($security_score/3)${NC}"
    elif [ $security_score -eq 1 ]; then
        echo -e "${YELLOW}⚠️  Sécurité moyenne ($security_score/3)${NC}"
    else
        echo -e "${RED}❌ Sécurité faible ($security_score/3)${NC}"
    fi
fi

# Vérification de la compression
echo -n "Compression gzip... "
if curl -H "Accept-Encoding: gzip" -I -s "$SITE_URL" --max-time 10 | grep -i "content-encoding.*gzip" > /dev/null; then
    echo -e "${GREEN}✅ Activée${NC}"
else
    echo -e "${YELLOW}⚠️  Non détectée${NC}"
fi

# Résumé final
echo -e "\n${BLUE}📊 Résumé du déploiement${NC}"
echo "=================================="
echo "🌐 Site web : $SITE_URL"
echo "🛒 API : $API_URL"
echo "📅 Date : $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${GREEN}✅ Vérification terminée !${NC}"
echo ""
echo "💡 Actions recommandées :"
echo "   1. Tester l'application manuellement"
echo "   2. Vérifier les logs Nginx"
echo "   3. Monitorer les performances"

# Test de connectivité depuis différents emplacements (optionnel)
if command -v dig > /dev/null && [ "$SITE_URL" != "http://localhost" ]; then
    echo -e "\n${YELLOW}🌍 Test DNS${NC}"
    echo "----------"
    domain=$(echo "$SITE_URL" | sed 's|.*://||' | sed 's|/.*||')
    echo -n "Résolution DNS pour $domain... "
    if dig +short "$domain" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${RED}❌ ERREUR${NC}"
    fi
fi
