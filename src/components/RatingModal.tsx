import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Star } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const RatingModal = ({ isOpen, onClose, onSubmit }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Avalie o Atendimento</DialogTitle>
          <DialogDescription className="text-center">
            Sua opinião é muito importante para nós!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center items-center gap-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer transition-colors ${
                (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
            Enviar Avaliação e Encerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
