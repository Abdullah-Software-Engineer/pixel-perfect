import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { submitTicket, clearError } from '@/store/slices/maintenanceSlice';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Upload } from 'lucide-react';

interface TicketDrawerProps {
  siteId: string;
  siteName: string;
}

export function TicketDrawer({ siteId, siteName }: TicketDrawerProps) {
  const dispatch = useAppDispatch();
  const { submitting, error } = useAppSelector(state => state.maintenance);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    woTemplate: '',
    site: siteName,
    zone: '',
    region: '',
    clusterId: '',
    hubSite: '',
    templateName: '',
    assignee: '',
    subject: '',
    activityPerformer: '',
    serviceImpact: '',
    opcat1: '',
    opcat2: '',
    plannedStartTime: '',
    plannedEndTime: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    try {
      await dispatch(submitTicket(formData)).unwrap();
      toast({
        title: 'Success',
        description: `Work order ${asDraft ? 'saved as draft' : 'submitted'} successfully!`,
      });
      setOpen(false);
      // Reset form
      setFormData({
        woTemplate: '',
        site: siteName,
        zone: '',
        region: '',
        clusterId: '',
        hubSite: '',
        templateName: '',
        assignee: '',
        subject: '',
        activityPerformer: '',
        serviceImpact: '',
        opcat1: '',
        opcat2: '',
        plannedStartTime: '',
        plannedEndTime: '',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'Failed to submit work order',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Work Order
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto scrollbar-thin bg-popover border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Create Work Order</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new work order.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="woTemplate">Select WO Template</Label>
            <Select onValueChange={(v) => handleInputChange('woTemplate', v)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                <SelectItem value="inspection">Site Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site">Select Site</Label>
            <Select value={formData.site} onValueChange={(v) => handleInputChange('site', v)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={siteName}>{siteName}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Input 
                id="zone"
                className="bg-input border-border"
                value={formData.zone}
                onChange={(e) => handleInputChange('zone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input 
                id="region"
                className="bg-input border-border"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clusterId">Cluster ID</Label>
              <Input 
                id="clusterId"
                className="bg-input border-border"
                value={formData.clusterId}
                onChange={(e) => handleInputChange('clusterId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hubSite">Hub Site</Label>
              <Input 
                id="hubSite"
                className="bg-input border-border"
                value={formData.hubSite}
                onChange={(e) => handleInputChange('hubSite', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateName">WO Template Name</Label>
            <Input 
              id="templateName"
              placeholder="Enter template name"
              className="bg-input border-border"
              value={formData.templateName}
              onChange={(e) => handleInputChange('templateName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select onValueChange={(v) => handleInputChange('assignee', v)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="jane">Jane Doe</SelectItem>
                <SelectItem value="mike">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input 
              id="subject"
              placeholder="Enter Subject"
              className="bg-input border-border"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityPerformer">Activity Performer *</Label>
            <Input 
              id="activityPerformer"
              placeholder="Enter Activity Performer"
              className="bg-input border-border"
              value={formData.activityPerformer}
              onChange={(e) => handleInputChange('activityPerformer', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceImpact">Service Impact *</Label>
            <Select onValueChange={(v) => handleInputChange('serviceImpact', v)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select Service Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opcat1">OpCAT T1 *</Label>
              <Select onValueChange={(v) => handleInputChange('opcat1', v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select OpCAT T1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="opcat2">OpCAT T2 *</Label>
              <Select onValueChange={(v) => handleInputChange('opcat2', v)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select OpCAT T2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cat1">Category 1</SelectItem>
                  <SelectItem value="cat2">Category 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plannedStartTime">Planned Start Time *</Label>
              <Input 
                id="plannedStartTime"
                type="datetime-local"
                className="bg-input border-border"
                value={formData.plannedStartTime}
                onChange={(e) => handleInputChange('plannedStartTime', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedEndTime">Planned End Time *</Label>
              <Input 
                id="plannedEndTime"
                type="datetime-local"
                className="bg-input border-border"
                value={formData.plannedEndTime}
                onChange={(e) => handleInputChange('plannedEndTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
            >
              Save as Draft
            </Button>
            <Button 
              className="flex-1"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
