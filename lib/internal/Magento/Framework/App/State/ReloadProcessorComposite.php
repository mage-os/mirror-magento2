<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);
namespace Magento\Framework\App\State;

use \Magento\Framework\ObjectManagerInterface;

/**
 * Composite of reload processors
 */
class ReloadProcessorComposite implements ReloadProcessorInterface
{
    /**
     * @param ReloadProcessorInterface[] $processors
     */
    public function __construct(private array $processors)
    {}

    /**
     * {@inheritdoc}
     */
    public function reloadState(ObjectManagerInterface $objectManager): void
    {
        /** @var ReloadProcessorInterface $processor */
        foreach ($this->processors as $processor) {
            $processor->reloadState($objectManager);
        }
    }
}
