<?php

namespace App\Console\Commands;

use App\Actions\Orders\ExpireUnpaidOrders;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('orders:expire-unpaid {--chunk= : Number of orders processed per batch}')]
#[Description('Expire unpaid orders whose payment window has elapsed and release their inventory')]
class ExpireUnpaidOrdersCommand extends Command
{
    public function handle(ExpireUnpaidOrders $expireUnpaidOrders): int
    {
        $chunkOption = $this->option('chunk');
        $chunkSize = $chunkOption === null ? null : filter_var($chunkOption, FILTER_VALIDATE_INT);

        if ($chunkOption !== null && ($chunkSize === false || $chunkSize < 1)) {
            $this->error('The --chunk option must be an integer greater than zero.');

            return self::INVALID;
        }

        $count = $expireUnpaidOrders->handle(chunkSize: $chunkSize === false ? null : $chunkSize);

        $this->info("Expired {$count} unpaid order(s).");

        return self::SUCCESS;
    }
}
