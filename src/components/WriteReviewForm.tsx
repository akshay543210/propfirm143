import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Star, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface WriteReviewFormProps {
  firmId: string;
  firmName: string;
  onClose: () => void;
}

const WriteReviewForm = ({ firmId, firmName, onClose }: WriteReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    
    if (rating === 0 || !content.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rating and review content.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          firm_id: firmId,
          rating,
          title: title.trim() || null,
          content: content.trim(),
          reviewer_name: reviewerName.trim() || 'Anonymous'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been submitted successfully!"
      });

      // Reset form
      setRating(0);
      setHoverRating(0);
      setTitle('');
      setContent('');
      setReviewerName('');
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    setShowAuthDialog(false);
    if (action === 'login') {
      navigate('/login');
    } else {
      navigate('/signup');
    }
  };

  return (
    <>
      <Card className="bg-slate-700/50 border-blue-500/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Write a Review for {firmName}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Rating *
              </label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      i < (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600 hover:text-yellow-400'
                    }`}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>

            {/* Reviewer Name */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your Name (optional)
              </label>
              <Input
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Leave blank to post as Anonymous"
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Review Title (optional)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Great experience with fast payouts"
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Your Review *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience with this prop firm..."
                rows={4}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0 || !content.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-slate-900"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-slate-800 border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Authentication Required</DialogTitle>
            <DialogDescription className="text-gray-300">
              You need to be signed in to submit a review. Please log in or create an account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => handleAuthAction('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Log In
            </Button>
            <Button 
              onClick={() => handleAuthAction('signup')}
              variant="outline"
              className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-slate-900"
            >
              Sign Up
            </Button>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowAuthDialog(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WriteReviewForm;