<?php

namespace Gene\BlueFoot\Controller\Adminhtml\Stage\Template;

/**
 * Class Save
 *
 * @package Gene\BlueFoot\Controller\Adminhtml\Stage\Widget
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
class Save extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var \Gene\BlueFoot\Model\Stage\TemplateFactory
     */
    protected $template;

    /**
     * Save constructor.
     *
     * @param \Magento\Backend\App\Action\Context              $context
     * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
     * @param \Gene\BlueFoot\Model\Stage\TemplateFactory       $templateFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Gene\BlueFoot\Model\Stage\TemplateFactory $templateFactory
    ) {
        parent::__construct($context);

        $this->resultJsonFactory = $resultJsonFactory;
        $this->template = $templateFactory;
    }

    /**
     * Allow users to save templates to be rebuilt on the front-end
     *
     * @return $this
     */
    public function execute()
    {
        if ($this->getRequest()->getParam('structure')) {
            $postData = $this->getRequest()->getParams();
            $postData['has_data'] = ($this->getRequest()->getParam('has_data') == 'true' ? 1 : 0);

            $template = $this->template->create();
            $template->addData($postData);
            if ($template->save()) {
                // Include the new template data in the response
                $templateData[] = [
                    'id' => $template->getId(),
                    'name' => $template->getData('name'),
                    'preview' => $template->getData('preview'),
                    'structure' => $template->getData('structure'),
                    'pinned' => (bool) $template->getData('pinned')
                ];
                return $this->resultJsonFactory->create()->setData(['success' => true, 'template' => $templateData]);
            }
        }

        return $this->resultJsonFactory->create()->setData(['success' => false]);
    }
}
