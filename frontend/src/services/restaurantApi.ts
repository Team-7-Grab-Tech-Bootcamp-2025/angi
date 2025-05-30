import axios from "axios";
import type {
  Restaurant,
  RestaurantDetails,
  RestaurantListParams,
  RestaurantApiResponse,
  RestaurantDetailsApiResponse,
  RestaurantReviewsParams,
  RestaurantReviewsResponse,
  RestaurantReviewResponse,
  RestaurantReview,
  RestaurantReviews,
  MenuItem,
} from "../types/restaurant";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Transform snake_case to camelCase
const transformRestaurant = (data: RestaurantApiResponse): Restaurant => ({
  id: data.id,
  name: data.name,
  latitude: data.latitude,
  longitude: data.longitude,
  address: data.address,
  rating: data.rating,
  reviewCount: data.review_count,
  cityId: data.city_id,
  districtId: data.district_id,
  foodTypeName:
    data.food_type_name === "Unknown" ? "Món khác" : data.food_type_name,
  distance: data.distance,
});

const transformRestaurantDetails = (
  data: RestaurantDetailsApiResponse,
): RestaurantDetails => ({
  restaurant: transformRestaurant(data.restaurant),
  labels: data.labels,
  platforms: data.platforms,
  ratingPlatforms: data.rating_platforms,
});

const transformReview = (data: RestaurantReviewResponse): RestaurantReview => ({
  feedback: data.feedback,
  label: data.label,
  rating: data.rating,
  ratingId: data.rating_id,
  ratingLabel: data.rating_label,
  reviewTime: data.review_time,
  username: data.username,
});

export const restaurantApi = {
  getAll: async (
    params?: RestaurantListParams,
  ): Promise<{
    restaurants: Restaurant[];
    totalCount: number;
  }> => {
    const response = await api.get<{
      data: {
        restaurants: RestaurantApiResponse[];
        totalCount: number;
      };
    }>("/restaurants", { params: { ...params, count: true } });
    return {
      restaurants: response.data.data.restaurants.map(transformRestaurant),
      totalCount: response.data.data.totalCount,
    };
  },

  getById: async (id: string): Promise<RestaurantDetails> => {
    const response = await api.get<{ data: RestaurantDetailsApiResponse }>(
      `/restaurants/${id}`,
    );
    return transformRestaurantDetails(response.data.data);
  },

  search: async (params: {
    query: string;
    limit?: number;
  }): Promise<Restaurant[]> => {
    const response = await api.get<{ data: RestaurantApiResponse[] }>(
      "/restaurants/search",
      { params },
    );
    return response.data.data.map(transformRestaurant);
  },

  getRestaurantReviews: async (
    params: RestaurantReviewsParams,
  ): Promise<RestaurantReviews> => {
    const { id, label, page, textonly } = params;
    const queryParams = {
      label,
      page,
      count: true,
      ...(textonly && { textonly }),
    };

    const response = await api.get<{ data: RestaurantReviewsResponse }>(
      `/restaurants/${id}/reviews`,
      { params: queryParams },
    );

    return {
      reviews: response.data.data.reviews.map(transformReview),
      totalReviews: response.data.data.total_reviews,
    };
  },

  getRestaurantMenu: async (id: string): Promise<MenuItem[]> => {
    const response = await api.get<{ data: MenuItem[] }>(
      `/restaurants/${id}/menu`,
    );
    return response.data.data;
  },
};
