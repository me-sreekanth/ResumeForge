import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Recipe } from '../../../shared/types/Recipe';

type Props = {
  recipe: Recipe;
};

function RecipeCard({ recipe }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text>Cooking Time: {recipe.cookTime} mins</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default React.memo(RecipeCard);
