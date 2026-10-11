<?php

namespace App\Console\Commands;

use App\Actions\Cart\MarkAbandonedCarts;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('carts:mark-abandoned')]
#[Description('Mark inactive carts containing items as abandoned')]
class MarkAbandonedCartsCommand extends Command
{
    public function handle(MarkAbandonedCarts $markAbandonedCarts): int
    {
        $count = $markAbandonedCarts->handle();

        $this->info("Marked {$count} cart(s) as abandoned.");

        return self::SUCCESS;
    }
}
