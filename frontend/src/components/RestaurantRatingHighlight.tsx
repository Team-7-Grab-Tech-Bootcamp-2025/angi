import { useEffect, useState } from "react";
import { Card, Flex, Progress, Typography, Rate, Row, Col } from "antd";
import type { RatingCategory } from "../constants/categoryConstants";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_NAMES,
} from "../constants/categoryConstants";
import "./RestaurantRatingHighlight.css";
import type { RestaurantReviewLabel } from "../types/restaurant";

const { Title, Text } = Typography;

interface CategoryRatings {
  food: number;
  service: number;
  delivery: number;
  price: number;
  ambience: number;
}

interface CategoryRatingCount {
  food: number;
  service: number;
  delivery: number;
  price: number;
  ambience: number;
}

interface RestaurantRatingHighlightProps {
  categoryRatings: CategoryRatings;
  categoryRatingCount: CategoryRatingCount;
  averageRating: number;
  onLabelClick: (label: RestaurantReviewLabel) => void;
  selectedLabel: RestaurantReviewLabel;
}

const RestaurantRatingHighlight: React.FC<RestaurantRatingHighlightProps> = ({
  categoryRatings,
  categoryRatingCount,
  averageRating,
  onLabelClick,
  selectedLabel,
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const categories = Object.keys(CATEGORY_NAMES).map((key) => {
    const categoryKey = key as RatingCategory;
    return {
      name: CATEGORY_NAMES[categoryKey],
      key: categoryKey.toLowerCase() as RestaurantReviewLabel,
      rating: categoryRatings[categoryKey],
      count: categoryRatingCount[categoryKey],
      icon: CATEGORY_ICONS[categoryKey],
      color: CATEGORY_COLORS[categoryKey],
    };
  });

  return (
    <Card
      className="rating-card"
      style={{ backgroundColor: "#f7e8d3" }}
      variant="borderless"
    >
      {/* Average Rating Header */}
      <div className="rating-header">
        <Title level={2} className="text-white">
          Điểm đánh giá chung
        </Title>

        <Flex vertical align="center">
          <div className="relative">
            <div className="rating-average-background"></div>
            <Flex className="rating-average" align="center" justify="center">
              <Title level={1} className="rating-average-text">
                {averageRating.toFixed(1)}
              </Title>
            </Flex>
          </div>
          <Rate
            allowHalf
            disabled
            defaultValue={averageRating}
            className="my-2"
            style={{ color: "#112d4e" }}
          />
        </Flex>
      </div>

      {/* Category Cards */}
      <Row gutter={[16, 16]}>
        {categories.map((category, index) => (
          <Col
            xs={{ flex: "100%" }}
            md={{ flex: "50%" }}
            xl={{ flex: "20%" }}
            key={category.key}
            style={{
              transition: "all 0.5s ease",
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <Card
              variant="borderless"
              className={`rating-category-card ${category.key === selectedLabel ? "rating-category-selected" : ""}`}
              styles={{ body: { padding: "16px" } }}
              hoverable
              onClick={() => onLabelClick(category.key)}
            >
              <Flex vertical align="center" justify="center" gap={0}>
                <Flex
                  style={{
                    backgroundColor: category.color,
                  }}
                  align="center"
                  justify="center"
                  className="rating-category-icon"
                >
                  {category.icon}
                </Flex>

                <Title level={5} className="rating-category-title">
                  {category.name}
                </Title>

                <Title level={2} className="rating-category-value">
                  {category.rating.toFixed(1)}
                </Title>

                <Rate
                  allowHalf
                  disabled
                  defaultValue={category.rating}
                  style={{ color: category.color }}
                  className="my-2"
                />

                <Progress
                  percent={(category.rating / 5) * 100}
                  showInfo={false}
                  strokeColor={category.color}
                  size="default"
                />

                <Text type="secondary" className="mt-1">
                  {category.count.toLocaleString()} đánh giá
                </Text>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default RestaurantRatingHighlight;
