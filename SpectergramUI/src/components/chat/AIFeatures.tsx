import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Sparkles, 
  Brain, 
  TrendingUp,
  MessageSquare,
  Clock,
  Users
} from "lucide-react";

interface AIFeaturesProps {
  onClose: () => void;
}

const AIFeatures = ({ onClose }: AIFeaturesProps) => {
  const mockSummary = {
    keyPoints: [
      "Discussed building a premium chat application",
      "Mentioned AI features and futuristic design",
      "Showed interest in the project development"
    ],
    sentiment: "positive",
    topics: ["Technology", "Projects", "AI Development"],
    duration: "15 min conversation"
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="p-4">
        <Card className="glass border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Chat Summary</CardTitle>
                  <CardDescription className="text-xs">
                    Powered by advanced AI analysis
                  </CardDescription>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Key Points */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Key Discussion Points</span>
              </div>
              <ul className="space-y-1">
                {mockSummary.keyPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-muted-foreground flex items-start space-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Stats and Info */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Sentiment</span>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                  {mockSummary.sentiment}
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {mockSummary.duration}
                </span>
              </motion.div>
            </div>

            {/* Topics */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Topics Discussed</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockSummary.topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Badge 
                      variant="outline" 
                      className="text-xs glass border-border/50"
                    >
                      {topic}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex space-x-2 pt-2"
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="glass border-border/50 hover:bg-primary/10"
              >
                <Users className="h-3 w-3 mr-1" />
                Export Summary
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="glass border-border/50 hover:bg-accent/10"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Get Insights
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AIFeatures;