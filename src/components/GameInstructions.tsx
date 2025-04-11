
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const GameInstructions: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Nasıl Oynanır</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Nasıl Oynanır?</DialogTitle>
          <DialogDescription>
            Kelime Bulmaca'da amacınız, 6 denemede gizli kelimeyi bulmaktır.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Kurallar:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Her tahmin 5 harfli geçerli bir kelime olmalıdır.</li>
              <li>Her tahmin sonrası renk değişir ve ipucu verir:</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-game-correct border-2 border-green-300 rounded-md font-bold">
                T
              </div>
              <span>Harf doğru ve doğru konumda (Yeşil).</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-game-present border-2 border-yellow-300 rounded-md font-bold">
                A
              </div>
              <span>Harf doğru ama yanlış konumda (Sarı).</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-game-absent border-2 border-gray-300 rounded-md font-bold">
                Z
              </div>
              <span>Harf kelimede yok (Gri).</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Örnek:</h3>
            <p>Gizli kelime: TAVAN olsun.</p>
            <div className="flex gap-1 my-2">
              <div className="w-10 h-10 flex items-center justify-center bg-game-correct border-2 border-green-300 rounded-md font-bold">T</div>
              <div className="w-10 h-10 flex items-center justify-center bg-game-correct border-2 border-green-300 rounded-md font-bold">A</div>
              <div className="w-10 h-10 flex items-center justify-center bg-game-absent border-2 border-gray-300 rounded-md font-bold">K</div>
              <div className="w-10 h-10 flex items-center justify-center bg-game-absent border-2 border-gray-300 rounded-md font-bold">I</div>
              <div className="w-10 h-10 flex items-center justify-center bg-game-absent border-2 border-gray-300 rounded-md font-bold">M</div>
            </div>
            <p className="text-sm mt-1">Tahmin edilen "TAKIM" kelimesinde T ve A doğru yerde, K, I ve M harfleri kelimede yok.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructions;
