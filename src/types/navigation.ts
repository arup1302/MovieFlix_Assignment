import { Movie } from './movie';
import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  CategoryList: {
    category: string;
  };
};

export type RootStackParamList = {
  MainTabs: undefined;
  Details: {
    movie: Movie;
  };
};

export type TabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Profile: undefined;
};
